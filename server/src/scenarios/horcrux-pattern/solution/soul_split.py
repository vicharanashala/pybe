import pickle
import json

class Wizard:
    def __init__(self, name, horcruxes_made):
        self.name = name
        self.horcruxes_made = horcruxes_made

def create_pickle_horcrux(wizard, filename):
    with open(filename, 'wb') as f:
        pickle.dump(wizard, f)

def resurrect_from_pickle(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)

if __name__ == '__main__':
    voldemort = Wizard('Tom Riddle', 7)
    
    # Split soul to disk
    create_pickle_horcrux(voldemort, 'diary.pkl')
    print('Horcrux created.')
    
    # Resurrect
    resurrected = resurrect_from_pickle('diary.pkl')
    print(f'Resurrected: {resurrected.name} with {resurrected.horcruxes_made} horcruxes.')
