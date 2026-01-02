import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function requestNotificationPermissions() {
    if (Platform.OS === 'web') return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return false;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return true;
}

export async function scheduleDailyReminders(hours: number[]) {
    // Clear any existing notifications first to avoid duplicates
    if (Platform.OS === 'web') return;
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const hour of hours) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: hour < 20 ? "C'est l'heure ! ⏰" : "Bilan du soir 🌙",
                body: "N'oubliez pas de noter vos dépenses/gains de la journée.",
            },
            trigger: {
                hour: hour,
                minute: 0,
                channelId: 'default',
                type: Notifications.SchedulableTriggerInputTypes.DAILY
            },
        });
    }
}

export async function cancelAllReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}
