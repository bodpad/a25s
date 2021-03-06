# Generated by Django 3.0.6 on 2020-06-04 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('algorithms', '0013_algorithm_cpp'),
    ]

    operations = [
        migrations.AddField(
            model_name='algorithm',
            name='difficulty',
            field=models.SmallIntegerField(choices=[(1, 'Easy'), (2, 'Medium'), (3, 'Hard')], default=1),
            preserve_default=False,
        ),
    ]
