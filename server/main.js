// Makes sure we don't run as root 

if( 0 === parseInt(process.env.SUDO_UID) ){
	try{
		process.setgid("node");
		process.setuid("node");
	} catch (err){
		console.log("failed to setgid / setuid");
	}
}
