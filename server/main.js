// Makes sure we don't run as root 
	try{
		process.setgid("node");
		process.setuid("node");
	} catch (err){
		console.log("failed to setgid / setuid");
	}
