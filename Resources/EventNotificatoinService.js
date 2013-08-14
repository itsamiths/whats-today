Ti.API.info('Service Called');

var AppIntent=Ti.Android.createIntent({
                  flags: Ti.Android.FLAG_ACTIVITY_CLEAR_TOP | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP,
                  className:'com.mkamithkumar.whatstoday.WhatsTodayActivity',
                  packageName:Ti.App.id
                });
AppIntent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
var NotificationClickAction=Ti.Android.createPendingIntent({
                                activity:Ti.Android.currentActivity,
                                intent:AppIntent,  
                                flags:Ti.Android.FLAG_UPDATE_CURRENT,
                                type:Ti.Android.PENDING_INTENT_FOR_ACTIVITY
                              });
var NotificationMembers = {contentTitle: 'My App Name',
                             contentText: 'My Notification Text',
                             icon: Ti.App.Android.R.drawable.appicon,
                             when: new Date().getTime(), // This will keep the time from showing on the notification
                             tickerText: 'Whats Today Event Notification!',
            				defaults:Titanium.Android.NotificationManager.DEFAULT_SOUND,
                             flags:(Ti.Android.FLAG_ONGOING_EVENT | Ti.Android.FLAG_NO_CLEAR),
                             contentIntent: NotificationClickAction
                            };
 
Ti.Android.NotificationManager.notify(2, Ti.Android.createNotification(NotificationMembers));
