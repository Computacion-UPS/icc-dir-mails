import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = "smtp.office365.com"
SMTP_PORT = 587

EMAIL = "ptorresp@ups.edu.ec"
PASSWORD = "18patp18PATP18"

with open("corro/correo.html", "r", encoding="utf-8") as file:
    html = file.read()

message = MIMEMultipart("alternative")
message["Subject"] = "Invitación: Build With AI — UPS Cuenca"
message["From"] = EMAIL
message["To"] = "pabloa_ec@hotmail.com"

message.attach(
    MIMEText(
        "La Carrera de Computación de la UPS te invita a Build With AI.",
        "plain",
        "utf-8"
    )
)

message.attach(MIMEText(html, "html", "utf-8"))

with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
    smtp.starttls()
    smtp.login(EMAIL, PASSWORD)
    smtp.send_message(message)