import json
import os
import hashlib
import hmac
import time
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Авторизация администратора для доступа к админ-панели
    Args: event - объект запроса с httpMethod, body
          context - контекст выполнения
    Returns: JWT токен или ошибка
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        password = body.get('password', '')
        
        admin_password = os.environ.get('ADMIN_PASSWORD', '')
        
        if not admin_password:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Server configuration error'}),
                'isBase64Encoded': False
            }
        
        if password != admin_password:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid password'}),
                'isBase64Encoded': False
            }
        
        secret_key = os.environ.get('KEY', 'default-secret-key')
        timestamp = str(int(time.time()))
        payload = f"admin:{timestamp}"
        token = hmac.new(secret_key.encode(), payload.encode(), hashlib.sha256).hexdigest()
        full_token = f"{payload}:{token}"
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'token': full_token,
                'message': 'Authentication successful'
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
