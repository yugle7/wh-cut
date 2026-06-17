import json

from main import main


def get_height(sheets):
    return max(h for w, h in sheets)


def stack(sheets, height):
    return [(0, i * height, w, h) for i, (w, h) in enumerate(sheets)]


def unstack(rects, height):
    dst = []
    for x, y, w, h in rects:
        i, y = divmod(y, height)
        while i >= len(dst):
            dst.append([])
        dst[i].append([x, y, w, h])
    return dst


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

        height = get_height(sheets)

        sheets = stack(sheets, height)
        pieces = count(pieces)

        print(sheets)
        print(pieces)

        rects = main(sheets, pieces)
        print(rects)
        res = unstack(rects, height)

        print(res)

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


if __name__ == '__main__':
    event = {
        'httpMethod': 'POST',
        'body': json.dumps({
            'drops': [(2700, 2054), (84, 72), (2784, 2054)],
            'takes': [(388, 324, True, 2), (805, 324, True, 6), (389, 334, True, 1), (1034, 334, True, 8), (734, 334, True, 2), (334, 284, True, 2)]
        })
    }
    print(handler(event, None))
