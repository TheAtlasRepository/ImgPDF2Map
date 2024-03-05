from setuptools import setup, find_packages

setup(
    name='Img2mapAPI',
    version='0.6.0-dev',
    packages=find_packages(where='img2mapAPI'),
    install_requires=[
        # list of packages your project depends on
        'fastapi',
        'uvicorn[standard]',
        'rasterio',
        'python-multipart',
        'pdf2image',
    ],
    classifiers=[
        # https://pypi.org/classifiers/
        'Development Status :: 2 - Pre-Alpha',
        'Framework :: FastAPI',
    ],
    python_requires='>=3.6',
    entry_points={
        'console_scripts': [
            'img2mapAPI = img2mapAPI.main:main',
        ],
    },
)