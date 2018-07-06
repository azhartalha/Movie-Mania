# Generated by Django 2.0.5 on 2018-07-06 10:39

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('moviemania', '0002_cast_display_picture'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='picture',
            name='link',
        ),
        migrations.AddField(
            model_name='picture',
            name='image',
            field=models.ImageField(default=django.utils.timezone.now, upload_to='uploaded_media'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='cast',
            name='display_picture',
            field=models.ImageField(blank=True, null=True, upload_to='uploaded_media'),
        ),
        migrations.AlterField(
            model_name='movie',
            name='display_picture',
            field=models.ImageField(blank=True, null=True, upload_to='uploaded_media'),
        ),
    ]
