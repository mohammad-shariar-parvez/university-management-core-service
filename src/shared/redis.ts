/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { SetOptions, createClient } from "redis";
import config from "../config";

const redisClient = createClient({
	url: config.redis.url
});
const redisPubClient = createClient({
	url: config.redis.url
});
const redisSubClient = createClient({
	url: config.redis.url
});


redisClient.on('error', (err) => console.log("Redis Error", err));
redisClient.on('connect', (err) => console.log("Redis Connect"));

const connect = async (): Promise<void> => {
	await redisClient.connect();
	await redisPubClient.connect();
	await redisSubClient.connect();
};
const disconnect = async (): Promise<void> => {
	await redisClient.quit();
	await redisPubClient.quit();
	await redisSubClient.quit();
};

const set = async (key: string, value: string, options?: SetOptions): Promise<void> => {
	await redisClient.set(key, value, options);
};
const get = async (key: string): Promise<string | null> => {
	return await redisClient.get(key);
};
const del = async (key: string): Promise<void> => {
	await redisClient.get(key);
};

const setAccessToken = async (userId: string, token: string): Promise<void> => {
	const key = `accesstoken:${userId}`;
	await redisClient.set(key, token, { EX: Number(config.redis.expire_in) });
};

const getAccessToken = async (userId: string): Promise<string | null> => {
	const key = `accesstoken:${userId}`;
	return await redisClient.get(key);
};
const delAccessToken = async (userId: string): Promise<void> => {
	const key = `accesstoken:${userId}`;
	await redisClient.get(key);
};


export const RedisClient = {
	connect,
	disconnect,
	set,
	get,
	del,
	setAccessToken,
	getAccessToken,
	delAccessToken,
	publish: redisClient.publish.bind(redisPubClient),
	subscribe: redisClient.subscribe.bind(redisSubClient)
};