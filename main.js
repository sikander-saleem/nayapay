import requests
import json

def handler(event, context):
    print("Handler function called.")  # Debugging print

    # Discord Webhook URL
    webhook_url = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN'

    # Get the client's IP address from the event headers
    client_ip = event['headers'].get('x-forwarded-for', '0.0.0.0').split(',')[0]
    print(f"Client IP: {client_ip}")  # Debugging print

    # Use ipinfo.io to get location data from the IP
    location_url = f"http://ipinfo.io/{client_ip}/json"
    try:
        location_data = requests.get(location_url).json()
        print(f"Location Data: {location_data}")  # Debugging print
    except Exception as e:
        print(f"Error fetching location data: {e}")  # Debugging print
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Error fetching location data"})
        }

    # Extract the data
    country = location_data.get('country', 'Unknown')
    region = location_data.get('region', 'Unknown')
    city = location_data.get('city', 'Unknown')
    org = location_data.get('org', 'Unknown')
    hostname = location_data.get('hostname', 'Unknown')

    print(f"Extracted Data - Country: {country}, Region: {region}, City: {city}, Organization: {org}, Hostname: {hostname}")  # Debugging print

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
    try:
        response = requests.post(webhook_url, data=json.dumps(data), headers={"Content-Type": "application/json"})
        print(f"Discord webhook response status: {response.status_code}")  # Debugging print
    except Exception as e:
        print(f"Error sending webhook: {e}")  # Debugging print
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Error sending webhook"})
        }

    # Return a response to the user
    if response.status_code == 204:
        print("Webhook successfully sent to Discord.")  # Debugging print
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Webhook sent to Discord!"})
        }
    else:
        print(f"Failed to send webhook. Status code: {response.status_code}")  # Debugging print
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": f"Failed to send webhook. Status code: {response.status_code}"})
        }
