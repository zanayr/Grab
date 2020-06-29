const grab = (() => {
    const grab = selector => {
        console.log(selector);
    };
    //  Asynchronous Methods
    grab.get = (path, options={}) => {
        return fetch(path, Object.assign({}, options, {method: 'GET'}));
    };
    grab.post = (path, options={}) => {
        return fetch(path, Object.assign({}, options, {method: 'POST'}));
    };
    grab.async = (executor) => {
        return new Promise(executor);
    };
    grab.send = (form, path, captcha) => {
        if (captcha) {
            captcha.ready(() => {
                captcha.execute(form.key, {action: 'submit'})
                    .then(token => {
                        const data = new URLSearchParams(new FormData(form.node));
                        data.append('token', token);
                        return fetch(path, {body: data, method: 'POST'});
                    })
                    .catch(error => console.error(error));
            });
        } else {
            const data = new URLSearchParams(new FormData(form.node));
            return fetch(path, {body: data, method: 'POST'});
        }
    };
    //  Ready Function
    grab.ready = callback => {
        const fn = e => {
            callback(e);
            window.removeEventListener('load', fn);
        };
        window.addEventListener('load', fn);
    };
    return grab;
})();