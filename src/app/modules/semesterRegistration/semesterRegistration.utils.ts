const getAvailableCourses = (
	offeredCourses: any,
	studentCompletedCourses: any,
	studentCurrentlyTakanCourses: any
) => {
	const completedCoursesId = studentCompletedCourses.map((course: any) => course.courseId)

	const availableCoursesList = offeredCourses
		.filter((offeredCourse: any) => !completedCoursesId.includes(offeredCourse.courseId))
		.filter((course: any) => {
			const preRequisites = course.course.preRequisite
			if (preRequisites.length === 0) {
				return true;
			}
			else {
				const preRequisiteIds = preRequisites.map((preRequisite: any) => preRequisite.preRequisiteId)
				return preRequisiteIds.every((id: string) => completedCoursesId.includes(id))
			}
		})
		.map((course: any) => {
			const isAlreadyTakenCourse = studentCurrentlyTakanCourses.find(
				(c: any) => c.offeredCourseId === course.id
			);


			if (isAlreadyTakenCourse) {
				//ISSUE - improve is sec b is available , then if click on it , after sec will remove and b will be added
				course.offeredCourseSections.map((section: any) => {
					if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
						section.isTaken1111 = true
					}
					else {
						section.isTaken = false
					}
				})
				return {
					...course,
					isTaken: true
				}
			}
			else {
				course.offeredCourseSections.map((section: any) => {
					section.isTaken = false
				});
				return {
					...course,
					isTaken: false
				}
			};
		});

	return availableCoursesList;
}

export const SemesterRegistrationUtils = {
	getAvailableCourses
}