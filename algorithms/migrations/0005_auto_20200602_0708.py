# Generated by Django 3.0.6 on 2020-06-02 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('algorithms', '0004_algorithm_clean_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='algorithm',
            old_name='name',
            new_name='name_en',
        ),
        migrations.AddField(
            model_name='algorithm',
            name='text_en',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='algorithm',
            name='text_ru',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
