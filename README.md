# ISSA Visualization Web Application

The [ISSA project](https://issa.cirad.fr/) focuses on the semantic indexing of scientific publications in an open archive.

This repository is a React-based web application meant to search articles from the ISSA knowledge base, and provide a visualization of their metadata.
It uses the services offered by the [backend application](https://github.com/issa-project/backend-services/).


## Installation

Pre-requisite: [node.js](https://nodejs.org/) 17, yarn.

Install the dependencies with `yarn install`.

## Configuration

Configuration parameters are set in files .env.production and .env.development.
In particular, `REACT_APP_BACKEND_URL` must be set to the URL of the backend application.

## Run

Run the application in development mode: ` yarn start`.
By default the application listens on port 3001. This can be changed in file [.env](.env.development).
Make sure the application is properly started by pointing your browser to:
```
http://localhost:3001/search
```

Note for Windows users: you may need to authorize the execution of scripts on Powershell (as admin): `set-executionpolicy unrestricted`

To deploy the application, run `yarn build` and copy the build directory to the web server where you want to host the application.


### Logging

Log traces are printed out on the browser's console. It can be deactivated in file [.env](.env.development) by setting property:
```
REACT_APP_LOG = off
```

## License

See the [LICENSE file](LICENSE).


## Cite this work

Franck MICHEL, Youssef MEKOUAR, ISSA Project (2022). ISSA visualization web application. https://github.com/issa-project/web-visualization/.


## Publications

ISSA: Generic Pipeline, Knowledge Model and Visualization tools to Help Scientists Search and Make Sense of a Scientific Archive.
Anne Toulet, Franck Michel, Anna Bobasheva, Aline Menin, Sébastien Dupré, Marie-Claude Deboin, Marco Winckler, Andon Tchechmedjiev.
_21st International Semantic Web Conference (ISWC)_, Oct 2022, Hangzhou, China. DOI: [⟨10.1007/978-3-031-19433-7_38⟩](https://dx.doi.org/10.1007/978-3-031-19433-7_38). [HAL](https://hal.science/hal-03807744)
