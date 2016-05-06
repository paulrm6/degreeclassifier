var options = {
	message: "We use local storage on this site so next time you visit you won't need to re-enter details.",
	yesButton: "Sounds Great!",
	noButton: "Stop"
};

var localStorageAllowed=true;

var html="<div id='cookies'><div id='cookieText'>"
	+options.message
	+"</div><div id='cookieBtns'><div id='cookieY'>"
	+options.yesButton
	+"</div><div id='cookieN'>"
	+options.noButton
	+"</div></div></div>";

$(document).ready(function() {
	if(typeof(Storage) !== "undefined") {
		if(!localStorage.local_storage_allowed) {
			$('body').append(html);
		}
	} else {
		storage=false;
	}
});

$(document).on("click","#cookieY,#cookieN",changeOption);

function changeOption() {
	var option = false;
	if(this.id=="cookieY") {
		option = true;
	}
	$('#cookies').fadeOut(300);
	localStorageAllowed=option;
	if(option) {
		localStorage.local_storage_allowed=true;
	} else {
		localStorage.clear();
	}
}