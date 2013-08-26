/* locate this file under:
 *    - Resources/android/
 *    or
 *    - app/assets/android/ (when working with Alloy)
 */

var service = Ti.Android.currentService;
var serviceIntent = service.getIntent();

setNotification();

Ti.Android.stopService(serviceIntent);

function setNotification(alarm) {
	var activity = Ti.Android.currentActivity;
	var intent = Ti.Android.createIntent({
		action : Ti.Android.ACTION_MAIN,
		className : 'com.itsamiths.whatstoday.WhatsTodayActivity',
		flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	});
	intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);

	var pending = Ti.Android.createPendingIntent({
		activity : activity,
		intent : intent,
		type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
		flags : Ti.Android.FLAG_ACTIVITY_NO_HISTORY
	});

	//var message = "Time is up!";

	var notificationOptions = {
		contentIntent : pending,
		contentTitle : 'Whats Today - Featured Event',
		contentText : 'Tap to see todays featured event',
		tickerText : 'Whats Today Event Notification!',
		when : "00",
		icon : Ti.App.Android.R.drawable.appicon,
		flags : Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS | Titanium.Android.FLAG_INSISTENT,
		sound : Titanium.Android.NotificationManager.DEFAULT_SOUND
	};

	var notification = Ti.Android.createNotification(notificationOptions);
	Ti.Android.NotificationManager.notify(1, notification);
	Ti.App.Properties.setBool("service_running", true);

	Ti.Media.vibrate([0, 100, 100, 200, 100, 100, 200, 100, 100, 200]);
}