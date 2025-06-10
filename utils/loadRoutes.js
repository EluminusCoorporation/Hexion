//Starts loading the routes
function loadRoutes(directory) {
  //for every file in directory
  fs.readdirSync(directory).forEach(file => {
    //Connects the paths
    const fullPath = path.join(directory, file);
    //Gets the file
    const stat = fs.statSync(fullPath);
    //checks if it is a directory
    if (stat.isDirectory()) {
      //sends it back to get Synced
      loadRoutes(fullPath);
    } else {
      //Else gets the full path
      const route = require(fullPath);
      //Applys the routes
      app.use("/", route);
    };
  });
};