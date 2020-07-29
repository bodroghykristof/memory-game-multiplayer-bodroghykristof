import data_handler


@data_handler.connection_handler
def username_is_already_used(cursor, username):
    query = '''
        SELECT *
        FROM users
        WHERE username = %(username)s
        '''
    cursor.execute(query, {'username': username})
    return cursor.fetchone()


@data_handler.connection_handler
def register_user(cursor, username, password):
    query = '''
        INSERT INTO users
        (username, hashed_password)
        VALUES (%(username)s, %(password)s)
        '''
    cursor.execute(query, {'username': username, 'password': password})


def check_login_data():
    pass