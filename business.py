import data_handler
import bcrypt


def hash_password(password):
    hashed_bytes = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(given_password, valid_hashed_password):
    valid_hashed_bytes_password = valid_hashed_password.encode('utf-8')
    return bcrypt.checkpw(given_password.encode('utf-8'), valid_hashed_bytes_password)


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
    cursor.execute(query, {'username': username, 'password': hash_password(password)})


@data_handler.connection_handler
def check_login_data(cursor, username, password):
    query = '''
        SELECT hashed_password AS password
        FROM users
        WHERE username = %(username)s
        '''
    cursor.execute(query, {'username': username})
    user_record = cursor.fetchone()
    if user_record:
        valid_password = user_record['password']
        return verify_password(password, valid_password)