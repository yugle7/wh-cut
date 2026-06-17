import json

from main import main


def stack(sheets):
    H = max(h for w, h in sheets)
    return [(0, i * H, w, h) for i, (w, h) in enumerate(sheets)]


def count(pieces):
    C = {}
    for w, h, z, c in pieces:
        k = (h, w, z) if z and w < h else (w, h, z)
        if k in C:
            C[k] += c
        else:
            C[k] = c

    return [(w, h, z, c) for (w, h, z), c in C.items()]


def handler(event, context):
    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed, use POST'})
        }

    body = event.get('body')

    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing request body'})
        }

    try:
        payload = json.loads(body)
        sheets = payload.get('drops')
        pieces = payload.get('takes')

        if not sheets or not pieces:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing "data" field in JSON'})
            }

        sheets = stack(sheets)
        pieces = count(pieces)

        print(sheets)
        print(pieces)

        res = {"sheets": sheets, "pieces": pieces}  # main(sheets, pieces)

        return {
            "statusCode": 200,
            "headers": {"content-type": "application/json"},
            "body": json.dumps(res)
        }
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON format'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Internal error: {str(e)}'})
        }
