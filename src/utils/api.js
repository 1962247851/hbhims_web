const API_BASE_URL = "https://api.ordinaryroad.top:415"
// const INSERT = "/insert"
const DELETE = "/delete"
const UPDATE = "/update"
const QUERY = "/query"
const SPORT = API_BASE_URL + "/sport"
const CAPTCHA_IMAGE = API_BASE_URL + "/captchaImage"
const USER = API_BASE_URL + "/user"

const URL = {
    //验证码接口
    CAPTCHA_IMAGE: CAPTCHA_IMAGE,

    //用户接口
    USER_LOGIN: USER + "/login",
    USER_LOGOUT: USER + "/logout",

    //运动记录接口
    INSERT_OR_REPLACE_SPORT: SPORT + "/insertOrReplace",
    DELETE_SPORT: SPORT + DELETE + "?id=",
    UPDATE_SPORT: SPORT + UPDATE,
    QUERY_ALL_SPORT: SPORT + QUERY,
}
module.exports = {
    API_BASE_URL: API_BASE_URL,
    URL: URL
}