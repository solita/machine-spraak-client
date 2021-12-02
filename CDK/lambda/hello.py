import json
import boto3
import uuid
import decimal
from urllib.parse import unquote_plus
import xml.etree.ElementTree as ET
import os

TABLE_NAME = os.environ['TABLE_NAME']
BUCKET_NAME = os.environ['BUCKET_NAME']
dynamodb = boto3.resource('dynamodb')


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)


def put_metadata_to_dynamodb(s3_id):
    try:
        table = dynamodb.Table(TABLE_NAME)
        response = table.put_item(
            Item={
                'audio_id': s3_id,
                'metadata': 'test1234'
            }
        )
        print("PutItem succeeded:")
        print(json.dumps(response, indent=4, cls=DecimalEncoder))
        return True
    except Exception as e:
        return e


def put_wav_to_s3_bucket(wav_path):
    try:
        key = "foo.txt"
        txt = "bar"
        s3_client = boto3.client('s3')
        s3_client.put_object(Body=txt, Bucket=BUCKET_NAME,
                             Key=key, ContentType='text/html')
        return key, True
    except Exception as e:
        return e, False


def handler(event, context):

    key, success_s3 = put_wav_to_s3_bucket('test.txt')
    if success_s3:
        success_db = put_metadata_to_dynamodb(key)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': "s3_upload_succeeded: %s, dynamodb_upload_succeed: %s" % (str(key), str(success_db))
    }
