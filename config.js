var config = function(){
    if(process.env.NODE_ENV === 'production') return process.env;
    else{
        return {
            PORT: "8080",
            MONGO_DB: "mongodb://admin:admin@ds139985.mlab.com:39985/pokememo",
            JWT_SECRET: "Kimi ni Kimeta!"
        };
    }
};

module.exports = config();