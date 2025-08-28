const CONSOLE_STYLE = {
    prefix: '%c Elaina - Auto Honor V2 ',
    css: 'color: #ffffff; background-color: #f77fbe'
};

export const log = (message: string, ...args: any[]) => console.log(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
export const warn = (message: string, ...args: any[]) => console.warn(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
export const error = (message: string, ...args: any[]) => console.error(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);