import pandas as pd
from sklearn.model_selection import train_test_split
from lightgdm import LGBMClassifier
import onnx
import skl2onnx

df = pd.read_csv("phishing_dataset.csv")

x = df.drop("label", axis=1)
y = df["label"]

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

model = LGBMClassifier()
model.fit(x_train, y_train)

from skl2onnx import to_onnx
onnx_model = to_onnx(model, x_train[:1).astype(np.float32))
with open("phishing_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
