from QuantileClient import QuantileClient

base_url = "https://quantileapibeta.online"  # Adjust to your server's base URL
api_key = "quant-nKaFGSbGbCYr01ueVrOTt		"

client = QuantileClient(base_url, api_key)
prompt = "what is an api"

# No neeed to specify model 

callcascade = client.call_cascading(
    prompt="Passion infotech startup fundings",
    max_tokens=200 ,
    parsed_output=True
)
print(callcascade)