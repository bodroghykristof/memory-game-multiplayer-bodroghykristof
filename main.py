from flask import Flask, render_template, request
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
        business.check_login_data()
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password_one = request.form.get('password-one')
        password_two = request.form.get('password-two')
        if password_one == password_two and not business.username_is_already_used(username):
            business.register_user(username, password_one)
        else:
            return render_template('register.html')
    return render_template('register.html')


if __name__ == '__main__':
    socketio.run(app)
