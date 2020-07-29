from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_socketio import SocketIO
import business

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


if __name__ == '__main__':
    socketio.run(app)
