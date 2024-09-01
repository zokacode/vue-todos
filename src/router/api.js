export const hexApi = 'https://todolist-api.hexschool.io';

export const hexSignUp = `${hexApi}/users/sign_up`;

export const hexSignIn = `${hexApi}/users/sign_in`;

export const hexCheckout = `${hexApi}/users/checkout`;

export const hexGetTodo = `${hexApi}/todos`;

export const hexInsTodo = `${hexApi}/todos`;

export const hexUpdateTodo = (id) => {
    return `${hexApi}/todos/${id}`
};

export const hexDelTodo = (id) => {
    return `${hexApi}/todos/${id}`
};

export const hexToggleTodo = (id) => {
    return `${hexApi}/todos/${id}/toggle`
};