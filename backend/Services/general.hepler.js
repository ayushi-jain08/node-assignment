const Res = (res, status, message, data) => {

    let res_obj = {

        "status": status,

        "message": message,

        "data": data

    }

    return res.status(status).json(res_obj)

};

export const sendError = (res, status, message) => {
    res.status(status).json({ error: { status, message } });
};

export default Res