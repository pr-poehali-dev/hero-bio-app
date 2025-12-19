import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Get database connection using DATABASE_URL environment variable"""
    return psycopg2.connect(
        os.environ['DATABASE_URL'],
        cursor_factory=RealDictCursor
    )

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с героями России
    GET / - получить всех героев
    POST / - создать нового героя
    PUT /{id} - обновить героя
    DELETE /{id} - удалить героя
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            cursor.execute("""
                SELECT id, name, rank, image, period, conflict, region, 
                       awards, birth_year, biography, timeline, 
                       created_at, updated_at
                FROM heroes
                ORDER BY created_at DESC
            """)
            heroes = cursor.fetchall()
            
            result = []
            for hero in heroes:
                result.append({
                    'id': hero['id'],
                    'name': hero['name'],
                    'rank': hero['rank'],
                    'image': hero['image'],
                    'period': hero['period'],
                    'conflict': hero['conflict'],
                    'region': hero['region'],
                    'awards': hero['awards'],
                    'birthYear': hero['birth_year'],
                    'biography': hero['biography'],
                    'timeline': hero['timeline']
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                INSERT INTO heroes (name, rank, image, period, conflict, region, 
                                  awards, birth_year, biography, timeline)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, name, rank, image, period, conflict, region, 
                          awards, birth_year, biography, timeline
            """, (
                body_data['name'],
                body_data['rank'],
                body_data['image'],
                body_data['period'],
                body_data['conflict'],
                body_data['region'],
                body_data['awards'],
                body_data['birthYear'],
                body_data['biography'],
                json.dumps(body_data['timeline'])
            ))
            
            conn.commit()
            hero = cursor.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': hero['id'],
                    'name': hero['name'],
                    'rank': hero['rank'],
                    'image': hero['image'],
                    'period': hero['period'],
                    'conflict': hero['conflict'],
                    'region': hero['region'],
                    'awards': hero['awards'],
                    'birthYear': hero['birth_year'],
                    'biography': hero['biography'],
                    'timeline': hero['timeline']
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            hero_id = body_data.get('id')
            
            cursor.execute("""
                UPDATE heroes 
                SET name = %s, rank = %s, image = %s, period = %s, 
                    conflict = %s, region = %s, awards = %s, birth_year = %s, 
                    biography = %s, timeline = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, name, rank, image, period, conflict, region, 
                          awards, birth_year, biography, timeline
            """, (
                body_data['name'],
                body_data['rank'],
                body_data['image'],
                body_data['period'],
                body_data['conflict'],
                body_data['region'],
                body_data['awards'],
                body_data['birthYear'],
                body_data['biography'],
                json.dumps(body_data['timeline']),
                hero_id
            ))
            
            conn.commit()
            hero = cursor.fetchone()
            
            if not hero:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Hero not found'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': hero['id'],
                    'name': hero['name'],
                    'rank': hero['rank'],
                    'image': hero['image'],
                    'period': hero['period'],
                    'conflict': hero['conflict'],
                    'region': hero['region'],
                    'awards': hero['awards'],
                    'birthYear': hero['birth_year'],
                    'biography': hero['biography'],
                    'timeline': hero['timeline']
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            hero_id = query_params.get('id')
            
            if not hero_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id parameter'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            cursor.execute("DELETE FROM heroes WHERE id = %s RETURNING id", (hero_id,))
            conn.commit()
            deleted = cursor.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Hero not found'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Hero deleted successfully'}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
