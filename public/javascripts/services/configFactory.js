app.factory('configFactory', ['$http',($http) => {
    const getConfig = () => {
      return new Promise((resolve, reject) => {
            $http
                .get('/getEnv')
                .then((data) => {
                    //console.log(data)
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err);
                })
      });
    };
    return{
        getConfig
    }
}]);