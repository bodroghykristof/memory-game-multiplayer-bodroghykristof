from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
import business
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = b'n\x18\xd9Pi\x98NB\xa7`i\xf5\xfb#\xa1\x1e'
socketio = SocketIO(app)


@app.route('/', methods=['GET', 'POST'])
def main_page():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user_record = business.check_login_data(username, password)
        if user_record:
            session['username'] = user_record['username']
            session['user_id'] = user_record['id']
            print(session)
            return redirect(url_for('rooms'))
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password_one = request.form.get('password-one')
        password_two = request.form.get('password-two')
        if password_one == password_two and not business.username_is_already_used(username):
            business.register_user(username, password_one)
            return redirect(url_for('main_page'))
        else:
            return render_template('register.html')
    return render_template('register.html')


@app.route('/rooms')
def rooms():
    open_rooms = business.get_open_rooms()
    return render_template('rooms.html', rooms=open_rooms)


@app.route('/add-room', methods=['POST'])
def add_room():
    user_data = request.get_json()
    username = user_data['username']
    user_id = user_data['user_id']
    room_data = business.create_new_room(user_id, username)
    return jsonify(room_data)


@app.route('/delete-room', methods=['DELETE'])
def delete_room():
    room_id = request.get_json()
    business.delete_room(room_id)
    return jsonify(room_id)


@app.route('/game')
def game():
    return render_template('game.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('user_id', None)
    return redirect(url_for("main_page"))


@socketio.on('create')
def create_new_room(room):
    join_room(str(room))
    # TODO: real-time update of new rooms


@socketio.on('join')
def join_open_room(room_info):
    info_object = json.loads(room_info)
    room_number = info_object['roomNumber']
    username = info_object['username']
    user_id = info_object['userid']
    business.mark_room_as_closed(room_number, username, user_id)
    join_room(room_number)
    emit('start_game', broadcast=True, room=room_number)
    # TODO: real-time update of closing rooms


@socketio.on('leave')
def leave_current_room(room):
    leave_room(room)
    # TODO: real-time update of deleted rooms


if __name__ == '__main__':
    socketio.run(app)
