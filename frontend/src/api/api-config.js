let backendHost;

const hostname = window && window.location && window.location.hostname;

if(hostname === "localhost") {
  backendHost = "http://localhost:8080";
} else {
  backendHost = "http://icareappbe01-env.eba-zatbiksu.ap-northeast-2.elasticbeanstalk.com";
}

//backendHost = "http://icareappbe01-env.eba-zatbiksu.ap-northeast-2.elasticbeanstalk.com";

export const API_BASE_URL = `${backendHost}`;