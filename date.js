exports.getDate = () => {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = today.toLocaleDateString("en-US", options);
    return day;
}

//having two or more functions makes it more reuseable depending....

exports.getDay = () => {
    let today = new Date();
    let options = {
        weekday: "long"
    }
    let day = today.toLocaleDateString("en-US", options);
    return day;
}