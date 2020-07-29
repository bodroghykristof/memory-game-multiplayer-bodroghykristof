from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = b'n\x18\xd9Pi\x98NB\xa7`i\xf5\xfb#\xa1\x1e'
socketio = SocketIO(app)

if __name__ == '__main__':
    socketio.run(app)
