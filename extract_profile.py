import json

# Read the JSON file
with open('infomaniak_api_1758004635.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

profile_endpoints = []

for path, methods in data['paths'].items():
    for method, details in methods.items():
        if 'tags' in details and details['tags']:
            for tag in details['tags']:
                if 'Profile' in tag:
                    endpoint = {
                        'path': path,
                        'method': method.upper(),
                        'tag': tag,
                        'summary': details.get('summary', ''),
                        'description': details.get('description', ''),
                        'parameters': details.get('parameters', []),
                        'requestBody': details.get('requestBody', {}),
                        'responses': details.get('responses', {}),
                        'security': details.get('security', [])
                    }
                    profile_endpoints.append(endpoint)

# Print a summary table first
print('INFOMANIAK API - PROFILE ENDPOINTS SUMMARY')
print('=' * 80)
print()

current_tag = None
for endpoint in sorted(profile_endpoints, key=lambda x: (x['tag'], x['path'], x['method'])):
    if endpoint['tag'] != current_tag:
        print(f"\n{endpoint['tag']}:")
        print('-' * (len(endpoint['tag']) + 1))
        current_tag = endpoint['tag']

    # Count required parameters
    required_params = len([p for p in endpoint['parameters'] if p.get('required', False)])
    has_body = bool(endpoint['requestBody'])

    print(f"  {endpoint['method']:6} {endpoint['path']:40} | {endpoint['summary']}")
    if required_params > 0:
        print(f"         {' '*40} | Required params: {required_params}")
    if has_body:
        print(f"         {' '*40} | Has request body")

print()
print('\nTOTAL PROFILE ENDPOINTS:', len(profile_endpoints))
print()
print('ENDPOINT BREAKDOWN BY TAG:')
tag_counts = {}
for endpoint in profile_endpoints:
    tag_counts[endpoint['tag']] = tag_counts.get(endpoint['tag'], 0) + 1

for tag, count in sorted(tag_counts.items()):
    print(f'  {tag}: {count} endpoints')