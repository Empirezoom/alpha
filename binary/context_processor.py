from .models import *





def general(request):
    t_site = CompanyProfile.objects.get(pk=1)
    featured = Feature.objects.all()
    stat = Stat.objects.all()

    context = {
    't_site': t_site,
    'featured': featured,
    'stat': stat,
    }

    return context