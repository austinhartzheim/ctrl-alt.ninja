#! /usr/bin/env python3
import argparse
import enum
import json
import os
import time

POLL_INTERVAL = 0.05


class Modes(enum.IntEnum):
    set = 1
    keep = 2


class LevelBuilder():
    def __init__(self, args):
        self.args = args
        self.level_states = []

        try:
            stat = os.stat(args.path)
            self.last_modified = stat.st_mtime
            self.capture_level_state()
        except FileNotFoundError:
            print('Specified file does not exist. Please create it with the')
            print('  initial level data before starting the level builder.')
            exit()

    def begin(self):
        try:
            while True:
                time.sleep(POLL_INTERVAL)
                self.loop()

        except KeyboardInterrupt:
            self.output_level()

    def loop(self):
        stat = os.stat(self.args.path)
        if self.last_modified != stat.st_mtime:
            self.capture_level_state()
        self.last_modified = stat.st_mtime

    def capture_level_state(self):
        with open(self.args.path, 'r') as fp:
            states = [line.strip('\r\n') for line in fp.readlines()]
            self.level_states.append(states)

    def output_level(self):
        steps = []
        for i in range(1, len(self.level_states)):
            step = {
                'start': self.level_states[i-1],
                'match': self.level_states[i],
            }

            if i == 1:
                step['pos'] = {
                    'mode': Modes.set,
                    'x': 0,
                    'y': 0
                }
            else:
                step['pos'] = {'mode': Modes.keep}

            steps.append(step)
        
        title = input('Title: ')
        desc_short = input('Short Description: ')
        desc_long = input('Long Description: ')
        msg_win = input('Win Message: ')

        level_obj = {
            'title': title,
            'desc_short': desc_short,
            'desc_long': desc_long,
            'msg_win': msg_win,
            'steps': steps
        }
        print(json.dumps(level_obj, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('path', help='Path to the level file')
    args = parser.parse_args()

    level_builder = LevelBuilder(args)
    level_builder.begin()
