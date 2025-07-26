from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

class JuegoMoneda:
    def __init__(self):
        self.jugadas = 0
        self.dinero_acumulado = 0
    
    def lanzar_moneda(self):
        return random.choice(['cara', 'sello'])
    
    def jugar(self, eleccion, apuesta):
        if eleccion not in ['cara', 'sello']:
            raise ValueError("Elección debe ser 'cara' o 'sello'")
        if apuesta <= 0:
            raise ValueError("La apuesta debe ser positiva")
        
        resultado = self.lanzar_moneda()
        self.jugadas += 1
        
        if eleccion == resultado:
            ganancia = apuesta * 2
            self.dinero_acumulado += ganancia
            return {'resultado': resultado, 'ganador': True, 'ganancia': ganancia}
        else:
            self.dinero_acumulado -= apuesta
            return {'resultado': resultado, 'ganador': False, 'ganancia': -apuesta}
    
    def get_estadisticas(self):
        return {
            'jugadas': self.jugadas,
            'dinero_acumulado': self.dinero_acumulado
        }

juego = JuegoMoneda()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/jugar', methods=['POST'])
def jugar():
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    try:
        data = request.get_json()
        eleccion = data.get('eleccion')
        apuesta = float(data.get('apuesta', 0))
        
        resultado = juego.jugar(eleccion, apuesta)
        return jsonify(resultado)
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route('/estadisticas')
def estadisticas():
    return jsonify(juego.get_estadisticas())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)