

var displaymode=0
var iframecode='<iframe id="external" style="width:100%;border:0px;" scrolling="no" src="http://www.ballmerasia.com/info/plus/list.php?tid=127"></iframe>'
if (displaymode==0)
document.write(iframecode)
function jumpto(inputurl){
if (document.getElementById&&displaymode==0)
document.getElementById("external").src=inputurl
else if (document.all&&displaymode==0)
document.all.external.src=inputurl
else{
if (!window.win2||win2.closed)
win2=window.open(inputurl)
else{
win2.location=inputurl
win2.focus()
}
}
}
