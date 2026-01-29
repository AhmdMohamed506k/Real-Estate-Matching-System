module.exports = {
  apps: [{
    name: "DashBoard-FreelanceApi",
    script: "./index.js",
    exec_mode: "cluster", 
    instances: "max",     
    watch: true,          
    
    
    ignore_watch: [
      "node_modules",
      "logs",
      "*.log",
      ".git"
    ],
    
  
    watch_delay: 1000, 

    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}