console.log("trying to kill " + process.pid);
process.kill(process.pid, 'SIGINT');