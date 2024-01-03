export function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}

export function secondsToMinSecs(time: number) {       
	const m = Math.floor(time % 3600 / 60);     
	const s = Math.floor(time % 3600 % 60);      
	const mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") + (s > 0 ? ", ":"") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return mDisplay + sDisplay;  
}