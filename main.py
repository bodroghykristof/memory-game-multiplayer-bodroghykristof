from flask import Flask, render_template, request
from flask_socketio import SocketIO
import business

app = Flask(__name__)
app.config['SECRET_KEY'] = b'n\x18\xd9Pi\x98NB\xa7`i\xf5\xfb#\xa1\x1e'
socketio = SocketIO(app)


@app.route('/', methods=['GET', 'POST'])
def main_page():
    if request.method == 'POST':
        business.check_login_data()
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        business.register_user()
    return render_template('register.html')


if __name__ == '__main__':
    socketio.run(app)
