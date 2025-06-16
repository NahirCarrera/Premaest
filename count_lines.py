import os

def count_lines_of_code(directory, extensions):
    total_lines = 0
    for dirpath, _, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(extensions):
                with open(os.path.join(dirpath, filename), 'r', encoding='utf-8', errors='ignore') as file:
                    total_lines += sum(1 for line in file)
    return total_lines

if __name__ == "__main__":
    directory = "E:\\NOVENO SEMESTRE\\CALIDAD\\Premaest"
    extensions = ('.js', '.tsx')
    lines = count_lines_of_code(directory, extensions)
    print(f'Total lines of code: {lines}')
