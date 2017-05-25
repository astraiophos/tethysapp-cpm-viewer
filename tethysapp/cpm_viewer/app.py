from tethys_sdk.base import TethysAppBase, url_map_maker


class CpmViewer(TethysAppBase):
    """
    Tethys app class for CPM Viewer.
    """

    name = 'CPM Viewer'
    index = 'cpm_viewer:home'
    icon = 'cpm_viewer/images/icon.gif'
    package = 'cpm_viewer'
    root_url = 'cpm-viewer'
    color = '#3498db'
    description = 'Viewer for the Central Plateau Model Results Figures'
    tags = 'Groundwater'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='cpm-viewer',
                           controller='cpm_viewer.controllers.home'),
                    # UrlMap(name='points',
                    #        url='cpm-viewer/points',
                    #        controller='cpm_viewer.controllers.points'),
        )

        return url_maps