from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = b'n\x18\xd9Pi\x98NB\xa7`i\xf5\xfb#\xa1\x1e'
socketio = SocketIO(app)


@app.route('/')
def main_page():
    return render_template('login.html')


if __name__ == '__main__':
    socketio.run(app)
