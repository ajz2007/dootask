export default {
    projectData(state) {
        let projectId = state.projectId;
        if (projectId == 0) {
            projectId = state.method.runNum(window.__projectId);
        }
        if (projectId > 0) {
            window.__projectId = projectId;
            const project = state.method.cloneJSON(state.projects.find(({id}) => id == projectId));
            if (project) {
                project.columns = state.method.cloneJSON(state.columns.filter(({project_id}) => {
                    return project_id == project.id
                })).sort((a, b) => {
                    if (a.sort != b.sort) {
                        return a.sort - b.sort;
                    }
                    return a.id - b.id;
                });
                project.columns.forEach((column) => {
                    column.tasks = state.method.cloneJSON(state.tasks.filter((task) => {
                        return task.column_id == column.id;
                    })).sort((a, b) => {
                        if (a.sort != b.sort) {
                            return a.sort - b.sort;
                        }
                        return a.id - b.id;
                    });
                })
                return Object.freeze(project);
            }
        }
        return {
            columns: [],
            project_user: []
        };
    },

    taskData(state) {
        let taskId = state.taskId;
        if (taskId == 0) {
            taskId = state.method.runNum(window.__taskId);
        }
        if (taskId > 0) {
            window.__taskId = taskId;
            const task = state.tasks.find(({id}) => id == taskId);
            if (task) {
                return task;
            }
        }
        return {};
    },

    tablePanel(state) {
        return function (key) {
            if (!state.projectId) {
                return false;
            }
            let cache = state.cacheTablePanel.find(({project_id}) => project_id == state.projectId);
            if (!cache) {
                cache = {
                    project_id: state.projectId,
                    card: true,
                    cardInit: false,
                    chat: false,
                    showMy: true,
                    showHelp: true,
                    showUndone: true,
                    showCompleted: false,
                    completedTask: false,
                }
                state.cacheTablePanel.push(cache);
            }
            return cache && !!cache[key];
        }
    }
}
