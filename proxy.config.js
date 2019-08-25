const PROXY_CONFIG = [
    {
        context: [
            "/login",
            "/logout",
            "/api"
        ],
        target: 'http://0.0.0.0:8888',
        secure: false
    }
]

module.exports = PROXY_CONFIG;